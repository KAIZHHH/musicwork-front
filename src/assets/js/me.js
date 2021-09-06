export const me = {
    methods: {
        //上传图片之前的校验   传参:this
        // 把它单独写成一个文件，不就是模块化，封装，解耦，这样如果修改上传逻辑，就不需要每个有上传的方法都要修改了
        beforeAvatorUpload(file,obj) {
            const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
            if(!isJPG){
                obj.$message({
                    showClose: true,
                    message: '上传头像图片只能是jpg或png格式',
                    type: 'error'
                });
                document.getElementById("upload").firstChild.lastChild.value = ""
                return false;
            }
            const isLt2M = (file.size / 1024 /1024) < 2;
            if(!isLt2M){
                obj.$message({
                    showClose: true,
                    message: '上传头像图片大小不能超过2MB',
                    type: 'error'
                });
                return false;
            }
            return true;
        },
        //上传文件成功之后要做的工作 传参:this
        handleFileSuccess(res,obj) {
            if(res.result == "success"){
                obj.getData();
                obj.$notify({
                    title: res.message,
                    type: 'success'
                });
            }else{
                obj.$notify({
                    title: res.message,
                    type: 'error'
                });
            }
        },
    }

}
