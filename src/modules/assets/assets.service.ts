import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as AWS from 'aws-sdk';
import { Model } from 'mongoose';

import { PaginationDto } from '@/common/dto/pagination.dto';

import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset.name) private readonly AssetModel: Model<Asset>,
  ) {}

  private getBucketName() {
    return process.env.S3_BUCKET_NAME;
  }

  private getS3() {
    return new AWS.S3({
      accessKeyId: process.env.S3_BUCKET_ACCESS_KEY,
      secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY,
      region: process.env.S3_BUCKET_REGION,
    });
  }

  private async uploadToS3(
    file: Express.Multer.File,
  ): Promise<string | undefined> {
    const name = file.originalname;
    const extension = name.split('.').pop();
    const type = file.mimetype;
    const time = Date.now();

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.getBucketName(),
      Key: String(
        `filixer/${name.replace(
          `.${extension}` as string,
          '',
        )}-${time}.${extension}`,
      ),
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: type,
      ContentDisposition: 'inline',
    };

    try {
      const s3 = this.getS3();
      const s3Response = await s3.upload(params).promise();
      return s3Response.Location;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async uploadOnefile(file: Express.Multer.File, user: string) {
    if (!file) {
      throw new BadRequestException();
    }
    const uploadFile = await this.uploadToS3(file);
    if (!uploadFile) {
      throw new InternalServerErrorException('Error when upload one file');
    }
    const asset = await this.AssetModel.create({
      ...file,
      url: uploadFile,
      createdBy: user,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return asset;
  }

  async uploadMultipleFiles(files: Array<Express.Multer.File>, user: string) {
    if (!files.length || files.length > 10) {
      throw new BadRequestException();
    }

    return Promise.all(files.map(async (file) => await this.uploadToS3(file)))
      .then(async (value) => {
        const assets = await this.AssetModel.create(
          value.map((url, index) => ({
            url,
            ...files[index],
            createdBy: user,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })),
        );
        return assets;
      })
      .catch((error) => {
        console.error('error promise all: ', error);
        throw new InternalServerErrorException(
          'Error when upload multiple file!',
        );
      });
  }

  async getAll(pagination: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = pagination;
    const assets = await this.AssetModel.find({
      isDeleted: false,
    })
      .sort([[sortBy, sortDirection]])
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.AssetModel.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(total / limit);
    return {
      data: assets,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getMe(pagination: PaginationDto, user: string) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = pagination;
    const assets = await this.AssetModel.find({
      isDeleted: false,
      createdBy: user,
    })
      .sort([[sortBy, sortDirection]])
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.AssetModel.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(total / limit);
    return {
      data: assets,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async delete(id: string) {
    const deletedAsset = await this.AssetModel.findOneAndUpdate({
      _id: id,
      isDeleted: false,
    });
    if (!deletedAsset) {
      throw new NotFoundException();
    }
    return deletedAsset;
  }
}
