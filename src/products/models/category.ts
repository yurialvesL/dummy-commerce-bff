export class Category{
    name: string;
    icon: string;

    constructor({ name, icon }: { name: string, icon: string }) {
        this.name = name;
        this.icon = icon;
      }
}