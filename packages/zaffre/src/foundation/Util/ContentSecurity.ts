//
// Hook for handling content security issues 
//

export class ContentSecurity {
  static assetPrefix: string;
  static nonce = "";

  static qualifyURL(url: string): string {
    return url.startsWith("/assets") && this.assetPrefix ? `${this.assetPrefix}${url}` : url;
  }

  static async fetch(url: string): Promise<Response> {
    return fetch(this.qualifyURL(url));
  }
}
