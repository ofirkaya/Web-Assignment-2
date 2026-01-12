import Comment, { IComment } from "../models/commentModel";
import BaseController from "./baseController";

class CommentController extends BaseController<IComment> {
    constructor() {
        super(Comment);
    }
}

export default new CommentController();
