declare module "turndown" {
  interface TurndownServiceOptions {
    headingStyle?: "setext" | "atx";
    hr?: string;
    bulletListMarker?: "-" | "*" | "+";
    codeBlockStyle?: "indented" | "fenced";
    fence?: string;
    emDelimiter?: "*" | "_";
    strongDelimiter?: "**" | "__";
    linkStyle?: "inlined" | "referenced";
    linkReferenceStyle?: "full" | "collapsed" | "shortcut";
    blankReplacement?(content: string, node: any, options: any): string;
    keepReplacement?(content: string, node: any, options: any): string;
    defaultReplacement?(content: string, node: any, options: any): string;
  }

  class TurndownService {
    constructor(options?: TurndownServiceOptions);
    addRule(key: string, rule: any): void;
    use(plugin: any): void;
    keep(tagNameOrFilter: any): void;
    remove(tagNameOrFilter: any): void;
    escape(str: string): string;
    turndown(html: string): string;
  }

  export default TurndownService;
}
