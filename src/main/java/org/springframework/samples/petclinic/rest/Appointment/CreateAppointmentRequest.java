package org.springframework.samples.petclinic.rest.Appointment;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

class CreateAppointmentRequest {
    @NotNull
    private Integer petId;
    @NotNull
    private Integer vetId;
    @NotNull
    private LocalDateTime startTime;

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
}
