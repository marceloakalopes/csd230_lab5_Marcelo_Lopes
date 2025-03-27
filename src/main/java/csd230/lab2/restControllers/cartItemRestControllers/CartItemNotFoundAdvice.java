package csd230.lab2.restControllers.cartItemRestControllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class CartItemNotFoundAdvice {

    @ExceptionHandler(CartItemNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String cartItemNotFoundHandler(CartItemNotFoundException ex) {
        return ex.getMessage();
    }
}