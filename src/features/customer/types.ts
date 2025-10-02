export type Faq = {
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
}

export type QnaFile = {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
}

export type Qna = {
  id: string;
  title: string;
  content: string;
  answer: string;
  status: string;
  createdAt: string;
  answeredAt: string;
  files: QnaFile[];
}

export type FaqList = {
  content: Faq[];
  size: number;
  totalItems: number;
}

export type QnaList = {
  content: Qna[];
  size: number;
  totalItems: number;
}

export type GetQnAListResponse = {
  qnas: Qna[];
  totalQnas: number;
}

export type CustomerQnaFileResponse = {
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
}

export type CustomerQnaResponse ={
  id: number;
  userId: number;
  title: string;
  content: string;
  status: string;
  answer: string | null;
  answeredAt: string | null;  // ISO 8601 string (ex: "2025-09-30T12:34:56Z")
  createdAt: string;          // ISO 8601 string
  files: CustomerQnaFileResponse[];
}

export type Notification = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export type NotificationList = {
  content: Notification[];
  size: number;
  totalItems: number;
}

export type GetNotificationListResponse = {
  notifications: Notification[];
  totalCounts: number;
}

export type PolicyClause = {
  id: string;
  title: string;
  body: string[];
};

export type PolicyDoc = {
  serviceName: string;
  locale: "ko-KR";
  version: string;
  updatedAt: string;
  clauses: PolicyClause[];
};

