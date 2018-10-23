package org.springframework.samples.petclinic.rest.Appointment;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.samples.petclinic.appointment.Appointment;
import org.springframework.samples.petclinic.service.AppointmentService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.MediaType;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;


@RestController
public class AppointmentRestController {
    private final AppointmentService appointmentService;

    public AppointmentRestController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping(value = "/api/v1/availabilities", produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public Collection<LocalDateTime> getAvailableStartTimesByDateAndVetId(
        @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam("vetId") Integer vetId
    )
    {
        return appointmentService.findAvailableSlotsOnDateByVetId(vetId, date);
    }

    @GetMapping(value = "/api/v1/appointments", produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public Collection<Appointment> getAllScheduledAppointments(
        @RequestParam("petId") Optional<Integer> petId,
        @RequestParam("vetId") Optional<Integer> vetId
    )
    {
        if (petId.isPresent() && vetId.isPresent()) {
            return appointmentService.findAllScheduledAppointmentsForPetAndVet(petId.get(), vetId.get());
        }

        if(petId.isPresent()) {
            return appointmentService.findAllScheduledAppointmentsForPet(petId.get());
        }

        if(vetId.isPresent()) {
            return appointmentService.findAllScheduledAppointmentsForVet(vetId.get());
        }

        return appointmentService.findAllScheduledAppointments();
    }

    @PostMapping(value = "/api/v1/appointments", produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    Appointment createNewAppointment(@RequestBody @Valid CreateAppointmentRequest createAppointmentRequest) {
        return appointmentService.createNewAppointment(
            createAppointmentRequest.getVetId(),
            createAppointmentRequest.getPetId(),
            createAppointmentRequest.getStartTime(),
            createAppointmentRequest.getStartTime().plusMinutes(AppointmentService.APPOINTMENT_DURATION_MINUTES)
        );
    }

    @DeleteMapping(value = "/api/v1/appointments/{appointmentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    Appointment cancelAppointment(@PathVariable Integer appointmentId) {
        return appointmentService.cancelAppointment(appointmentId);
    }
}
