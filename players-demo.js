(() => {
  const teams = {
    north: [
      [1,'Максим Орлов','ВР',18,1620,0,0,73,1],[2,'Кирилл Беляев','ЗАЩ',16,1378,1,2,81,3],[4,'Денис Фролов','ЗАЩ',18,1572,2,1,84,4],[5,'Никита Миронов','ЗАЩ',17,1478,1,1,86,3],[18,'Артём Корнеев','ЗАЩ',15,1231,0,3,79,2],[6,'Илья Давыдов','ПЗ',18,1515,3,4,88,3],[8,'Матвей Громов','ПЗ',17,1381,4,5,87,2],[10,'Андрей Зорин','ПЗ',18,1470,6,7,85,2],[7,'Роман Тихонов','НАП',17,1302,7,5,78,1],[9,'Павел Ветров','НАП',18,1491,12,3,76,2],[11,'Егор Смирнов','НАП',16,1210,8,4,80,1]
    ],
    orbit: [
      [1,'Иван Лапин','ВР',18,1620,0,0,71,1],[3,'Алексей Романов','ЗАЩ',17,1432,1,1,80,4],[4,'Никита Ершов','ЗАЩ',18,1545,1,2,83,3],[5,'Максим Данилов','ЗАЩ',16,1350,2,0,82,4],[17,'Даниил Фомин','ЗАЩ',15,1215,0,2,77,2],[6,'Арсений Голубев','ПЗ',18,1502,2,3,85,3],[8,'Сергей Котов','ПЗ',17,1361,3,4,84,2],[14,'Игорь Серов','ПЗ',16,1270,4,4,82,2],[7,'Степан Волков','НАП',18,1450,6,4,77,1],[9,'Александр Морозов','НАП',17,1410,10,2,75,2],[11,'Тимофей Зайцев','НАП',16,1180,7,3,79,1]
    ]
  };
  const fields=['number','name','role','games','minutes','goals','assists','accuracy','yellow'];
  for (const key of Object.keys(teams)) teams[key]=teams[key].map(row=>Object.fromEntries(fields.map((field,index)=>[field,row[index]])));
  let current='north', sort='goals', descending=true;
  function render(){
    const data=teams[current], title=current==='north'?'Север':'Орбита', top=[...data].sort((a,b)=>b.goals-a.goals)[0];
    document.querySelector('#playersTeamTitle').textContent=title; document.querySelector('#playersCount').textContent=data.length;
    document.querySelector('#playersTopName').textContent=top.name; document.querySelector('#playersTopGoals').textContent=`${top.goals} голов`;
    const sorted=[...data].sort((a,b)=>(descending?b[sort]-a[sort]:a[sort]-b[sort])||a.number-b.number);
    document.querySelector('#playersRows').replaceChildren(...sorted.map(player=>{
      const tr=document.createElement('tr'); const playerCell=document.createElement('td'),number=document.createElement('span'),name=document.createElement('strong');
      number.className='player-number'; number.textContent=player.number; name.textContent=player.name; playerCell.append(number,name);tr.append(playerCell);
      for(const key of ['role','games','minutes','goals','assists','accuracy','yellow']){const td=document.createElement('td');td.textContent=key==='accuracy'?`${player[key]}%`:player[key];if(key==='goals')td.className='players-goals';tr.append(td);}return tr;
    }));
    document.querySelectorAll('[data-player-sort]').forEach(button=>{const active=button.dataset.playerSort===sort;button.querySelector('span').textContent=active?(descending?'↓':'↑'):'';button.closest('th').setAttribute('aria-sort',active?(descending?'descending':'ascending'):'none');});
  }
  document.querySelectorAll('[data-players-team]').forEach(button=>button.addEventListener('click',()=>{current=button.dataset.playersTeam;document.querySelectorAll('[data-players-team]').forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});render();}));
  document.querySelectorAll('[data-player-sort]').forEach(button=>button.addEventListener('click',()=>{const next=button.dataset.playerSort;descending=sort===next?!descending:true;sort=next;render();}));
  render();
})();
