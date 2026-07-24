import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { XMLParser } from 'fast-xml-parser';

import type { XmlToJsonFormatResponse } from './XmlUtilsl';

@Injectable()
export class XmlUtilsService {
  private readonly logger = new Logger(XmlUtilsService.name);
  constructor(private readonly httpService: HttpService) {}

  parseXmlToJson(xmlData: string) {
    this.logger.verbose('function [ParseXmlToJson]');

    const parser = new XMLParser();
    const parsedResponse: XmlToJsonFormatResponse<any> = parser.parse(xmlData);

    if (!parsedResponse) {
      throw new Error('Invalid XML response');
    }
    if (!parsedResponse.Response.Results) {
      throw new Error(`XML Results Empty`);
    }

    return parsedResponse;
  }

  async getXML(uri: string) {
    this.logger.verbose(`function [GetXML]: ${uri}`);

    try {
      const response = await this.httpService.axiosRef.get(uri);
      this.logger.debug(`XML request (status: ${response.status})`);

      return this.parseXmlToJson(response.data);
    } catch (error) {
      this.logger.error(`XML fetch failed`, {
        uri,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        message: error.message,
      });
    }
  }
}
