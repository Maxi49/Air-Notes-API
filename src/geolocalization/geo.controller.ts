import { Controller } from '@nestjs/common';
import { GeoService } from './geo.service';

@Controller('geolocalization')
export class GeoController {
  constructor(private geoService: GeoService) {}
}
