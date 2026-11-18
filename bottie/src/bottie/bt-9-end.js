/* ---------- what the console sees ---------- */
return{
 start(){G.s='title';G.mi=0;G.t=0},
 resume(){if(!L||G.s==='title')return;G.s='play';toast('BACK IN THE CRIB')},
 mus:()=>'',
 paused:()=>G.s==='pause',
 update,draw,
 _:{G,MV,drawArt,drawBottie,drawSpawn,drawHuman,drawOpp,drawDev,drawWorld,drawSlam,drawOverlay,bigFace,flames,sky,skyline,led,capIcon,panel,wrap,ctx,hash,play,px,TS,targets:targets,fxTick,burst,ring,ftext,gain,addSpawn,foe,THEME,BLUE,BLUE2,GOLD,HOT,CHROME,CHROME2,CHROME3,INK,REAL,SONGS_ON,SUPERS,startSuper,superHit,fire,slam,DRIPS,say,useThing,TOOLS,haveTools,curTool,useTool,get L(){return L},get SV(){return SV},set SV(v){SV=v},LV,ORDER,ALBUM,DV,LN,startLevel,goCrib,finish,build,complete,give,aim,targets,goalState,bfs,solid,free,store,KEY}};
};
