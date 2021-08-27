const socket = io();

$(document).ready(()=>{
   
    socket.on('messages-db',(msgg)=>{
        msgg.forEach(msg=>{
            appendmessage(msg.message,'incoming',msg.user);
        })
        $('.main-div').scrollTop($('.main-div')[0].scrollHeight);
    })
    $('.messagearea').keydown((event) => {
        
        
        if(!event.shiftKey && event.key == 'Enter') {
           
            appendmessage(event.target.value.trim(),'outgoing',user);
            socket.emit('messagee',event.target.value.trim(),user);
            event.target.value = '';
            $('.main-div').scrollTop($('.main-div')[0].scrollHeight);
        }
    })
});
socket.on('joinedusr',(user)=>{
    joined(user);
    $('.main-div').scrollTop($('.main-div')[0].scrollHeight);
});
function joined(j){
    $('.main-div').append('<div class="joined  p-2 text-center text-white "><span class="text-black">'+j+'</span> joined the chat</div>')
}
socket.on('sentt',(msg,usr)=>{
    appendmessage(msg.trim(),'incoming',usr);
    $('.main-div').scrollTop($('.main-div')[0].scrollHeight);
})
function appendmessage(value,type,user){
    if(type == 'outgoing'){
        var newdiv = document.createElement('div');
        $(newdiv).addClass('outgoing bg-primary p-2 ps-2 m-2 text-white')   
        $(newdiv).append('<li class="username-msg text-end list-unstyled pe-3 bg-gradient rounded-3 fs-5">'+user+'</li>')
        $(newdiv).append('<hr class="dropdown-divider text-white">')
        $(newdiv).append('<li class="msg-send list-unstyled fs-6 ps-2">'+value+'</li>')
        $('.main-div').append(newdiv);
    }
    if(type == 'incoming'){
        var newdiv = document.createElement('div');
        $(newdiv).addClass('incoming bg-danger p-2 ps-2 m-2 text-white')   
        $(newdiv).append('<li class="username-msg text-end list-unstyled pe-3 bg-gradient rounded-3">'+user+'</li>')
        $(newdiv).append('<hr class="dropdown-divider text-white">')
        $(newdiv).append('<li class="msg-send list-unstyled fs-6 ps-2">'+value+'</li>')
        $('.main-div').append(newdiv);
    }
    
}