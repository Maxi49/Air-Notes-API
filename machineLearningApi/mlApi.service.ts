import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MlApiService {
  async getTextClasses(text: string): Promise<string> {
    try {
      const response = await axios.post('http://127.0.0.1:8000/classifier', {
        text,
      });
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
