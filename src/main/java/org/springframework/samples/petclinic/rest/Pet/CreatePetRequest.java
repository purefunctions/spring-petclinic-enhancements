package org.springframework.samples.petclinic.rest.Pet;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

public class CreatePetRequest {
    @NotNull
    @Size(min=1)
    private String name;

    @NotNull
    private Integer petTypeId;

    @NotNull
    private Integer ownerId;

    @NotNull
    private LocalDate birthDate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPetTypeId() {
        return petTypeId;
    }

    public void setPetTypeId(Integer petTypeId) {
        this.petTypeId = petTypeId;
    }

    public Integer getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Integer ownerId) {
        this.ownerId = ownerId;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
}
