export const fileNamer = (req:Express.Request,file :Express.Multer.File, callback:Function) => {

    if (!file) {
        return callback(new Error('ERROR NOMBRE ARCHIVO'),false);
        
    }
    console.log(file)
    console.log(file)
    const fileExtension = file.mimetype.split('/')[1];
    const fileName = `${file.originalname}.${fileExtension}`
     callback(null,fileName);
    
}