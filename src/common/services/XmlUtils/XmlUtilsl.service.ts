import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class XmlUtilsService {
  constructor(private readonly httpService: HttpService) {}
  parseXmlToJson(xmlData: string) {
    const parser = new XMLParser();
    return parser.parse(xmlData);
  }

  async getXML(uri: string) {
    const response = await this.httpService.axiosRef.get(uri);
    const jObj = this.parseXmlToJson(response.data);
    return jObj;
  }
}
