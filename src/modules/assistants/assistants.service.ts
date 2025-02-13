import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import OpenAI from 'openai';

import { PaginationDto } from '@/common/dto/pagination.dto';
import { EAssistantRole } from '@/types/enum';

import { AskDto } from './dto/ask.dto';
import { AssistantMessage } from './entities/assistant-message.entity';
import { AssistantRoom } from './entities/assistant-room.entity';

@Injectable()
export class AssistantsService {
  private openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  private readonly genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  private model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  constructor(
    @InjectModel(AssistantRoom.name)
    private readonly AssistantRoomModel: Model<AssistantRoom>,
    @InjectModel(AssistantMessage.name)
    private readonly AssistantMessageModel: Model<AssistantMessage>,
  ) {}

  async test() {
    const completion = await this.openai.chat.completions.create({
      messages: [
        { role: 'user', content: 'What the fucking are you?' },
        {
          role: 'assistant',
          content:
            'I’m an AI assistant created by DeepSeek, designed to help with information, answer questions, and assist with tasks. While I don’t have consciousness or emotions, I aim to provide clear, respectful, and honest support. If there’s something specific you need or want to discuss, feel free to ask—I’m here to help! 😊',
        },
        { role: 'user', content: 'Where are you born?' },
        {
          role: 'assistant',
          content:
            "I was developed by DeepSeek, a Chinese company dedicated to making AGI a reality. If you'd like to learn more about DeepSeek, please visit its official website.",
        },
        { role: 'user', content: "What's the highest mountain in the world?" },
        {
          role: 'assistant',
          content:
            'Mount Everest is the highest mountain in the world above sea level, with an elevation of 8,848.86 meters (29,031.7 feet). It is located in the Mahalangur Himal sub-range of the Himalayas, straddling the border between Nepal and the Tibet Autonomous Region of China.',
        },
        { role: 'user', content: "What's the second?" },
      ],
      model: 'deepseek/deepseek-r1:free',
    });

    return completion;
  }

  async sendMessage(body: AskDto, user: string) {
    const { room, content, role = EAssistantRole.USER } = body;
    let existRoom: Document;
    if (!room) {
      existRoom = await this.AssistantRoomModel.create({
        ...body,
        name: content,
        user,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      existRoom = await this.AssistantRoomModel.findById(body.room);
      if (!existRoom) {
        throw new NotFoundException();
      }
    }
    const newMessage = await this.AssistantMessageModel.create({
      content,
      room: existRoom._id,
      role,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await this.AssistantRoomModel.findByIdAndUpdate(existRoom._id, {
      updatedAt: Date.now(),
    });

    return newMessage;
  }

  async stream(room: string) {
    const messages = await this.AssistantMessageModel.find({
      isDeleted: false,
      room,
    });

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              "Importtant! Let's chat as like you are an AI of Filixer developed by Thanh Huy!",
          },
          ...messages.map(
            (mess) =>
              ({
                role: mess.role,
                content: mess.content,
              }) as any,
          ),
        ],
        model: 'deepseek/deepseek-r1:free',
        stream: true,
      });

      return completion;
    } catch (error) {
      console.error('🚀 ~ AssistantsService ~ create ~ error:', error);
      throw new InternalServerErrorException();
    }
  }

  async geminiStream(room: string) {
    const messages = await this.AssistantMessageModel.find({
      isDeleted: false,
      room,
    });
    try {
      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [
              {
                text: "Importtant! Let's chat as like you are an AI of Filixer developed by Thanh Huy!",
              },
            ],
          },
          ...messages.map((message) => ({
            role: message.role === 'user' ? message.role : 'model',
            parts: [
              {
                text: message.content,
              },
            ],
          })),
        ],
      });
      const result = await chat.sendMessageStream(
        messages[messages.length - 1].content,
      );
      return result;
    } catch (error) {
      console.error('🚀 ~ AssistantsService ~ create ~ error:', error);
      throw new InternalServerErrorException();
    }
  }

  async getRooms(user: string, query: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'updatedAt',
      sortDirection = 'desc',
    } = query;

    try {
      const rooms = await this.AssistantRoomModel.find({
        user,
        isDeleted: false,
      })
        .sort([[sortBy, sortDirection]])
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await this.AssistantRoomModel.countDocuments({
        user,
        isDeleted: false,
      });

      return {
        data: rooms,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('🚀 ~ AssistantsService ~ getRooms ~ error:', error);
      throw new InternalServerErrorException();
    }
  }

  async getRoomById(id: string) {
    const room = await this.AssistantRoomModel.findById(id);
    if (!room) {
      throw new NotFoundException();
    }
    return room;
  }

  async getMessages(room: string, user: string, query: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = query;
    try {
      const existRoom = await this.AssistantRoomModel.findOne({
        _id: room,
        user,
        isDeleted: false,
      });
      if (!existRoom) {
        throw new NotFoundException();
      }
      const messages = await this.AssistantMessageModel.find({
        room: existRoom._id,
      })
        .sort([[sortBy, sortDirection]])
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await this.AssistantMessageModel.countDocuments({
        room: existRoom._id,
      });

      return {
        data: messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('🚀 ~ AssistantsService ~ getRooms ~ error:', error);
      throw new InternalServerErrorException();
    }
  }
}
