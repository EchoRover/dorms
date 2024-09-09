

function renderEvents(alldata, day,timemet) {
    const data = alldata[day];
    var Container = document.getElementsByClassName('today')[0];
 
    
    if(timemet == 0){
        console.log(timemet)
        Container = document.getElementsByClassName('week')[0];
      
    } 
   
    const box = document.createElement('div');

    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentDecimalHours = currentHours + currentMinutes / 60;

    const title = document.createElement('div');
    title.classList.add('currentday');
    
    if (timemet == 1){
        const add =  " " + formatTime(parseTime(currentHours + ":" + currentMinutes));
        title.textContent = "Today " + day + add;
    }else{
        title.textContent =  day;

    }
    
    box.appendChild(title)

    const alldaycontainer = document.createElement('div');
    alldaycontainer.classList.add('allday');

    data.all_day.forEach(event => {
        const smalldiv = document.createElement('div');
        smalldiv.classList.add('allday_child');
        smalldiv.textContent = event;
        if (event.includes('Boys')) {
            smalldiv.classList.add('boys');
        }
        if (event.includes('Girls')) {
            smalldiv.classList.add('girls');
        }

        alldaycontainer.appendChild(smalldiv);

    });
    box.appendChild(alldaycontainer)


    const timelineContainer = document.createElement('div')
    timelineContainer.classList.add("timeline");
    timelineContainer.innerHTML = '';
   

    


    let previousEndTime = data.time_dependant[0].start;
    data.time_dependant.forEach(event => {
        const startTime = parseTime(event.start);

        const endTime = parseTime(event.end);


        if (startTime > previousEndTime) {
            const gapDiv = document.createElement('div');
            gapDiv.classList.add('blank');
            
            gapDiv.innerHTML = `
             <div class="name">--</div>
             <div class="timmings">${formatTime(previousEndTime)} to ${formatTime(startTime)}</div>
         `;
            if (currentDecimalHours < startTime && currentDecimalHours > previousEndTime && timemet == 1) {
                gapDiv.classList.add("current_time")
            }
            timelineContainer.appendChild(gapDiv);
        }


        const eventDiv = document.createElement('div');
        eventDiv.classList.add('blank');
        eventDiv.innerHTML = `
             <div class="name">${event.name}</div>
             <div class="timmings">${formatTime(startTime)} to ${formatTime(endTime)}</div>
         `;
        if (event.name.includes('Boys')) {
            eventDiv.classList.add('boys');
        }
        else if (event.name.includes('Girls')) {
            eventDiv.classList.add('girls');
        }
        else if (event.name.includes('Curfew')) {
            eventDiv.classList.add('curfew');
        }
        else if (event.name.includes('Classes')) {
            eventDiv.classList.add('classes');
        }
        
        if (currentDecimalHours >= startTime && currentDecimalHours <= endTime && timemet == 1) {
            eventDiv.classList.add("current_time")
        }
        timelineContainer.appendChild(eventDiv);

        previousEndTime = endTime;
    });



    box.appendChild(timelineContainer);
    Container.appendChild(box)


}

// Function to parse time in "HH:MM" or "H:MM" format into hours
function parseTime(time) {
    const [hour, minute] = time.split(":").map(Number);
    return hour + (minute ? minute / 60 : 0);
}
function formatTime(time) {
    let hour = Math.floor(time);
    let minute = Math.round((time - hour) * 60);
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    if (minute < 10) minute = '0' + minute;
    return `${hour}:${minute} ${period}`;
}



function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const currentTime = new Date();
            var dates = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
            const today = dates[currentTime.getDay()]
            renderEvents(data,today,1);
            dates = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",]

            dates.forEach(event =>{
                if (event == today){
                    

                }
                else{
                    renderEvents(data,event,0);
                }
                

            });
        })
        .catch(error => console.error('Error loading data:', error));
}

loadData()