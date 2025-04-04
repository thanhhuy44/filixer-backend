export enum EUserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum EArticleStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
}

export enum ESortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SubscribeStatus {
  CANCELED = 'CANCELED',
  ACTIVE = 'ACTIVE',
}

export enum ReportTargetType {
  ARTICLE = 'ARTICLE',
  COMMENT = 'COMMENT',
}

export enum ESizeType {
  NUMBER = 'number',
  LETTER = 'letter',
}

export enum EOrderStatus {
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  SHIPPING = 'SHIPPING',
  DELIVERING = 'DELIVERING',
  CANCEL = 'CANCEL',
  SUCCESS = 'SUCCESS',
}

export enum EPaymentMethod {
  COD = 'COD',
  BANKING = 'BANKING',
  MOMO = 'MOMO',
}

export enum EAssistantRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum EChatRoomType {
  PERSONAL = 'personal',
  GROUP = 'group',
}

export enum EChatMessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  LINK = 'link',
}

export enum EChatMessageRole {
  USER = 'user',
  SYSTEM = 'system',
}
