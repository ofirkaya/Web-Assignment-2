import Post, { IPost } from "../models/postModel";
import BaseController from "./baseController";

class PostController extends BaseController<IPost> {
    constructor() {
        super(Post);
    }
}

export default new PostController();
