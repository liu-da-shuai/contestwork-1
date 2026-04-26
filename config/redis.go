package config

import (
	"context"

	"github.com/go-redis/redis/v8"
)

var RDB *redis.Client

func InitRedis() {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	_, err := rdb.Ping(context.Background()).Result()
	if err != nil {
		panic("redis connect failed")
	}
	RDB = rdb
}
