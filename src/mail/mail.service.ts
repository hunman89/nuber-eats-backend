import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    this.sendEmail('testing', 'test');
  }

  private async sendEmail(subject: string, content: string) {
    const from = new FormData();
    from.append('from', `Excited User <mailgun@${this.options.domain}>`);
    from.append('to', `hunman89@gmail.com`);
    from.append('subject', subject);
    from.append('text', content);

    const response = await got(
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: from,
      },
    );
    console.log(response.body);
  }
}
