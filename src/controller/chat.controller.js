
export default class ChatContoller{
    async getChatView(req,res,next){
        res.render("chat.ejs");
    }
}