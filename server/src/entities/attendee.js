export default class Attendee {
    constructor({ id, img, isSpeaker, roomId, username, peerId }) {
        this.id = id;
        this.img = img;
        this.isSpeaker = isSpeaker;
        this.roomId = roomId;
        this.username = username;
        this.peerId = peerId;
    }
}
