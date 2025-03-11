export interface MenuNode {
    nodeName: string;
    level: number;
    children: MenuNode[];
    path:string;
}
