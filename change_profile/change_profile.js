/* https://github.com/CO2tanso/roll20api_tanso/tree/main/change_profile */

const setting = {
    // 캐릭터 시트의 특정 영역을 사용한다면 true로 바꿔주세요.
    use_sheet: false,
    // 시트 사용을 true로 한 경우, 사용할 태그의 name을 적어주세요.
    // 태그명에서 'attr_'은 지우고 적어야 합니다.
    tag_name: "memo"
}
on("chat:message", function(msg) {
    if (msg.type == "api") {
        if (msg.content.indexOf("!@") === 0) {
            try {
                let characters = findObjs({type:'character',name:msg.who});
                if (!characters || characters.length === 0) {
                    sendChat("ERROR", `/w gm "${msg.who}"의 저널을 찾을 수 없습니다.`);
                    return;
                }
                
                let character = characters[0];
                
                let pfname = msg.content.match(/@([^\s]+)/);
                if (!pfname || pfname.length === 0) return;
                let pf = pfname[1];
                
                
                if (setting.use_sheet) {
                    let bio = findObjs({_type: "attribute", _characterid: character.id, name: setting.tag_name})[0].get("current");
                    
                    const regex = new RegExp(`${pf}\\(([^)]+)\\)`);
                    let searchLink = bio.match(regex);
                    if (!searchLink || searchLink === "null") return;
                    let link = searchLink[1]
                    
                    character.set('avatar', link);
                    sendChat("", "/desc <div style='display: block; height: 0px; line-height: 0px; overflow: hidden; visibility: hidden;'>.</div>");
                }
                else {
                    character.get('bio', function(bioContents) {
                        if (!bioContents || bioContents === "null") return;
                        
                        const regex = new RegExp(`${pf}\\(([^)]+)\\)`);
                        let searchLink = bioContents.match(regex);
                        if (!searchLink || searchLink === "null") return;
                        let link = searchLink[1]
                        
                        character.set('avatar', link);
                        sendChat("", "/desc <div style='display: block; height: 0px; line-height: 0px; overflow: hidden; visibility: hidden;'>.</div>");
                    });
                }
                
            } catch (err) {
                sendChat("ERROR", "/w gm 오류 발생: " + err.message);
            }
        }
    }
});
