package org.springframework.samples.petclinic.service.Exceptions;

public class BadRequestException extends RuntimeException {
   public BadRequestException(String message)  {
       super(message);
   }
}
