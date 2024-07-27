import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MlApiService {
  async createPostVectorIdentifier(text: string, img: string): Promise<string> {
    try {
      const formData = new FormData();

      formData.append('image', img);

      const response = await axios.post(
        'http://127.0.0.1:8000/create-vector-classificator',
        {
          text: text,
          img: formData,
        },
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
