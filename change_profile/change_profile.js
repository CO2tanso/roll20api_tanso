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
                
                // 캐 시트 메모란 사용 방식
                /*let bio = findObjs({_type: "attribute", _characterid: character.id, name: "memo"})[0].get("current");
                
                const regex = new RegExp(`${pf}\\(([^)]+)\\)`);
                let searchLink = bio.match(regex);
                if (!searchLink || searchLink === "null") return;
                let link = searchLink[1]
                
                character.set('avatar', link);
                sendChat("", "/desc <div style='display: block; height: 0px; line-height: 0px; overflow: hidden; visibility: hidden;'>.</div>");
                */
                
                // 개요 및 정보 사용 방식
                character.get('bio', function(bioContents) {
                    if (!bioContents || bioContents === "null") return;
                    
                    const regex = new RegExp(`${pf}\\(([^)]+)\\)`);
                    let searchLink = bioContents.match(regex);
                    if (!searchLink || searchLink === "null") return;
                    let link = searchLink[1]
                    
                    character.set('avatar', link);
                    sendChat("", "/desc <div style='display: block; height: 0px; line-height: 0px; overflow: hidden; visibility: hidden;'>.</div>");
                });
                
            } catch (err) {
                sendChat("ERROR", "/w gm 오류 발생: " + err.message);
            }
        }
    }
});
