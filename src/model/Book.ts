export class Book {
    id : string | null;
    title: string;
    author : string;
    launchDate : Date | null;
    locatorId : string;

    constructor(
        {
            id = null,
            title = "",
            author = "",
            launchDate = new Date(),
            locatorId = "",
        }: Partial<Book>) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.launchDate = launchDate;
        this.locatorId = locatorId;
    }
}