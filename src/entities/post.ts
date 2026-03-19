export type Post = {
  id: string;
  authorUserId: string;
  type: string;
  text: string;
  mediaURL: string;
  sportTag: string;
  topic: string;
  relatedPickupGameId: string;
  createdAt: Date;
  updatedAt: Date;
  visibility: string;
}