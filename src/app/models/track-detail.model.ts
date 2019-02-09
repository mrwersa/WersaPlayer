export class TrackDetail {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.title = obj && obj.title || null;
        this.description = obj && obj.description || null;
        this.thumbnailUrl = obj && obj.thumbnailUrl || null;
    }
}