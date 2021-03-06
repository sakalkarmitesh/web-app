let Post=require('../../../models/post');
let Comment=require('../../../models/comment');
module.exports.index= async function(req,res){

    let posts= await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
       path:'comments',
       populate:{
         path:'user'
       }
    });

    return res.json(200,{
        message:"Lists of Posts",
        posts:posts
    })
}

module.exports.destroy= async function(req,res){
   
  try{
      let post= await Post.findById(req.params.id);
      
      if(post.user==req.user.id){
       post.remove();
   
        await Comment.deleteMany({post:req.params.id});

       
           return res.json(200,{
             message:"Post deleted successfully"
           });
   }else{
       return res.json(401,{
            message:"user cannot delete post"
       });
   }
  }catch(err){
    console.log('error',err);
    return res.json(500,{
      message:"Internal Server error"
    });
  }
 
  
}