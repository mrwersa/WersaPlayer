export class TrackDetail {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    playing: boolean;
    progress: number;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.title = obj && obj.title || null;
        this.description = obj && obj.description || null;
        this.thumbnailUrl = obj && obj.thumbnailUrl || null;
        this.playing = obj && obj.playing || false;
        this.progress = obj && obj.progress || 0;
    }
}