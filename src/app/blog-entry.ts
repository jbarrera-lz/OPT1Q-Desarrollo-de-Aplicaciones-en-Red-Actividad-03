export interface BlogEntry {
    id: number,
    name: string,
    author: string,
    description: string,
    photo_description: string
    date: string,
}

export class Post implements BlogEntry {
    constructor(
        public id: number,
        public name: string,
        public author: string,
        public description: string,
        public photo_description: string,
        public date: string
    ){}

    public getMarkdownFile(): string | undefined {
        if (this.id === undefined || this.id === null) {
            return ``;
        }
        else {
            return `src/assets/posts/${this.id}.md`
        }
    }

    public getMainPicture(): string | undefined {
        if (this.id === undefined || this.id === null) {
            return ``;
        }
        else {
            return `src/assets/img/${this.id}.jpg`
        }
    }

    public getPhotoDescription(): string | undefined {
        if (this.id === undefined || this.id === null) {
            return ``;
        }
        else {
            return `Picture - ${this.id}.jpg. ${this.photo_description}`
        }
    }
}