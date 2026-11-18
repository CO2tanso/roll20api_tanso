/*https://github.com/CO2tanso/roll20api_tanso/tree/main/roll_sound*/

const rollsound_setting = {
    //GM및 PL(PC) 모두가 같은 효과음이라면 true로 설정해 주세요. (효과음의 주크박스 이름 설정은 dice)
    gmpl_sep: false,
    
    //캐릭터별 효과음 사용이라면 true, PC 공통이라면 false로 설정해 주세요.
    private_sound: false
}

const charList = {
    // "저널명": "bgm명", 구조로 입력해 주세요. ','도 포함입니다.
    "저널1": "sound1", //해당 코드는 예시입니다. 지워도 그대로 둬도 문제 없습니다.
}
function getSoundName(name) {
    return charList[name] || "";
}

on("chat:message", function(msg) {
    if (msg.type === "rollresult" || (msg.inlinerolls && msg.inlinerolls.length > 0)) {
        let isGM = playerIsGM(msg.playerid);
        var tracks;
        var trackTitle = "";
        
        
        if (rollsound_setting.gmpl_sep) {
            trackTitle = "dice";
        }
        else {
            
            if (isGM) {
                trackTitle = "gm dice";
            }
            else {
                if (rollsound_setting.private_sound) {
                    var chaName = msg.who;
                    trackTitle = getSoundName(chaName);
                }
                else {
                    trackTitle = "pl dice";
                }
            }
            
        }
        
        try {
            tracks = findObjs({
                _type: "jukeboxtrack",
                title: trackTitle
            });
        
            var track = tracks[0];
        
            track.set("playing", true);
            track.set("softstop", false);
        }
        catch (err) {
            sendChat('roll_sound','/w GM 주크박스 효과음 이름 혹은 코드 내 변수 설정이 잘못되었습니다.');
        }
    }
});
