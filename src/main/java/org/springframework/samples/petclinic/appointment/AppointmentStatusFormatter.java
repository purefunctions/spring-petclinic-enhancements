package org.springframework.samples.petclinic.appointment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.Formatter;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Collection;
import java.util.Locale;

@Component
public class AppointmentStatusFormatter implements Formatter<AppointmentStatus> {

    private final AppointmentRepository appointments;


    @Autowired
    public AppointmentStatusFormatter(AppointmentRepository appointments) {
        this.appointments = appointments;
    }

    @Override
    public String print(AppointmentStatus status, Locale locale) {
        return status.getName();
    }

    @Override
    public AppointmentStatus parse(String text, Locale locale) throws ParseException {
        Collection<AppointmentStatus> statuses = this.appointments.findAppointmentStatuses();
        for (AppointmentStatus status : statuses) {
            if (status.getName().equals(text)) {
                return status;
            }
        }
        throw new ParseException("type not found: " + text, 0);
    }

}
