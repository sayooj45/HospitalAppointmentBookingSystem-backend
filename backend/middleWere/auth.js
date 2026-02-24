import jwt from 'jsonwebtoken'

function authentication (req,res,next){
    const cookie = req.headers.cookie
    console.log(cookie);

    if(cookie){
        const [name,token] = cookie.trim().split('=')
        console.log('name',name);
        console.log('token',token);

        if(name=== 'logToken'){
            const decode = jwt.verify(token,process.env.SECRET_KEY)
            console.log(decode);
            req.name = decode.userName,
            req.role = decode.userRole
            
            console.log(req.name);
            
            next()
            
        }
        else{
            console.log('wrong token');
            res.status(400).send('wrong token')
            
        }
    }
    else{
        console.log('cookie not found');
        res.status(404).send('cookie not found')
        
    }
     
}

export default authentication