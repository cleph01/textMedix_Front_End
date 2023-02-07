import React from "react";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

function Calendar({ events }) {
    return (
        <FullCalendar
            maxHeigh="150px"
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
        />
    );
}

export default Calendar;
