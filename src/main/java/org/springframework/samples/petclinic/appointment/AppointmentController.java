package org.springframework.samples.petclinic.appointment;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.MediaType;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

class AppointmentInfo {
    private Integer petId;
    private Integer vetId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public Integer getPetId() {
        return petId;
    }

    public void setPetId(Integer petId) {
        this.petId = petId;
    }

    public Integer getVetId() {
        return vetId;
    }

    public void setVetId(Integer vetId) {
        this.vetId = vetId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}


@Controller
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping(value = "/api/v1/availabilities", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @Transactional
    public Collection<LocalDateTime> getAvailableStartTimesByDateAndVetId(
        @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam("vetId") Integer vetId
    )
    {
        return appointmentService.findAvailableSlotsOnDateByVetId(vetId, date);
    }

    @GetMapping(value = "/api/v1/appointments", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
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
    @ResponseBody
    @Transactional
    Appointment createNewAppointment(@RequestBody AppointmentInfo appointmentInfo) {
        return appointmentService.createNewAppointment(
            appointmentInfo.getVetId(),
            appointmentInfo.getPetId(),
            appointmentInfo.getStartTime(),
            appointmentInfo.getEndTime()
        );
    }
}
