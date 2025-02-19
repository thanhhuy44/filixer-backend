import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { EChatRoomType } from '@/types/enum';

import { User } from '../users/entities/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoom } from './entities/chat-room.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(ChatRoom.name) private readonly ChatRoomModel: Model<ChatRoom>,
    @InjectModel(ChatMessage.name)
    private readonly ChatMessageModel: Model<ChatMessage>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  async findAll() {
    return `This action returns all chat`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  async remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async online(user: string, status: boolean) {
    try {
      return await this.UserModel.findByIdAndUpdate(
        user,
        {
          isOnline: status,
          lastOnline: Date.now(),
          updatedAt: Date.now(),
        },
        {
          new: true,
        },
      );
    } catch (error) {
      console.error('🚀 ~ ChatService ~ onLine ~ error:', error);
      throw new InternalServerErrorException();
    }
  }

  async createRoom(body: CreateRoomDto, user: string) {
    if (body.type === EChatRoomType.PERSONAL) {
      const existRoom = await this.ChatRoomModel.findOne({
        members: body.members,
        type: EChatRoomType.PERSONAL,
      });
      if (existRoom) {
        throw new ConflictException();
      }
    }
    try {
      const newRoom = await this.ChatRoomModel.create({
        ...body,
        createdBy: user,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return newRoom;
    } catch (error) {
      console.error('🚀 ~ ChatService ~ createRoom ~ error:', error);
      throw new InternalServerErrorException();
    }
  }

  async getRooms(pagination: PaginationDto, user: string) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'updatedAt',
      sortDirection = 'desc',
    } = pagination;
    const data = await this.ChatRoomModel.aggregate([
      {
        $match: {
          'members.user': user, // Only rooms where the user is a member
          deletedBy: {
            $ne: user,
          },
        },
      },
      {
        $lookup: {
          from: 'ChatMessage', // Collection name of messages
          let: { roomId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$room', '$$roomId'] }, // Match messages in the room
                    { $not: { $in: [user, '$seenBy'] } }, // Messages not seen by the user
                  ],
                },
              },
            },
            {
              $count: 'unreadMessagesCount', // Count unread messages
            },
          ],
          as: 'unreadMessages',
        },
      },
      {
        $addFields: {
          unreadMessagesCount: {
            $cond: {
              if: { $gt: [{ $size: '$unreadMessages' }, 0] }, // If there are unread messages
              then: { $arrayElemAt: ['$unreadMessages.count', 0] },
              else: 0, // Default to 0 if no unread messages
            },
          },
        },
      },
      {
        $sort: {
          [sortBy]:
            sortDirection === 'asc' || sortDirection === 'ascending' ? 1 : -1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);

    const total = await this.ChatRoomModel.countDocuments({
      'members.user': user,
      deletedBy: {
        $ne: user,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async deleteRoom(id: string, user: string) {
    const deletedRoom = await this.ChatRoomModel.findOneAndUpdate(
      {
        _id: id,
        'members.user': user,
        deletedBy: {
          $ne: user,
        },
      },
      {
        $addToSet: {
          deletedBy: user,
        },
        updatedAt: Date.now(),
      },
      {
        new: true,
      },
    );
    if (!deletedRoom) {
      throw new NotFoundException();
    }

    await this.ChatMessageModel.updateMany(
      {
        room: id,
      },
      {
        $addToSet: {
          seenBy: user,
          deletedBy: user,
        },
        updatedAt: Date.now(),
      },
    );

    return deletedRoom._id;
  }

  async sendMessage(body: SendMessageDto, user: string) {
    try {
      return await this.ChatMessageModel.create({
        ...body,
        sender: user,
        seenBy: [user],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('🚀 ~ ChatService ~ sendMessage ~ error:', error);
      throw new InternalServerErrorException();
    }
  }
}
