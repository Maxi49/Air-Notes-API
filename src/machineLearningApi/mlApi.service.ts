import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MlApiService {
  async createPostVectorIdentifier(text: string, img: string): Promise<string> {
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/create-vector-classificator',
        {
          text,
          img,
        },
      );

      const vector = res.data.vector;

      return vector;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
