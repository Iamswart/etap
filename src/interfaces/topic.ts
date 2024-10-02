export interface CreateTopicInterface {
    title: string;
    description?: string;
    videoUrl?: string;
    subjectId: string;
    order: number;
  }
  
  export interface UpdateTopicInterface {
    title?: string;
    description?: string;
    videoUrl?: string;
    order?: number;
  }