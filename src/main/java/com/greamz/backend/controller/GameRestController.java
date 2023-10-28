package com.greamz.backend.controller;

import com.greamz.backend.model.GameModel;
import com.greamz.backend.service.GameModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/v1/game")
@RequiredArgsConstructor
public class GameRestController {
    private final GameModelService service;
    @GetMapping("/findALl")
    public ResponseEntity<Iterable<GameModel>> findAll(){
        List<GameModel> gameModels = service.findAll();
        return ResponseEntity.ok(gameModels);
    }
    @GetMapping("/findById/{appid}")
    public ResponseEntity<GameModel> findByAppid(@PathVariable("appid") Long appid){
        try {
            GameModel gameModel = service.findGameByAppid(appid);
            return ResponseEntity.ok(gameModel);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/create")
    public GameModel create(@RequestBody GameModel game){
        service.saveGameModel(game);
        return game;
    }
    @GetMapping("{appid}")
    public GameModel getOne(@PathVariable("appid") Long appid) {
        return service.findByAppid(appid);
    }

    @DeleteMapping("/delete/{appid}")
    public void delete(@PathVariable("appid") Long appid){
        service.deleteGameByAppid(appid);
    }
    @GetMapping("/findByCategory/{categoryId}")
    public ResponseEntity<List<GameModel>> findByCategory(@PathVariable("categoryId") Long categoryId){
        List<GameModel> gameModels = service.findGameByCategory(categoryId);
        return ResponseEntity.ok(gameModels);
    }

}
