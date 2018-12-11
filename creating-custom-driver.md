# Creating a custom driver

## What is a driver?

Drivers are used to state the way in which you want to have your `context` stored. Our implementation offers you to store data in files or in memory, but you should feel free to create any other adapter as you wish.

## Driver template & examples

In order to create a custom driver you have to follow the `DriverInterface`. In new custom driver implementation you must create a getter, setter, creator, remover and existance checker.

**Template:**

```php
<?php

namespace App;

use Colloquy\Drivers\DriverInterface;

class CustomDriver implements DriverInterface
{
    /**
     * Retrieves a single value from the context.
     *
     * @param string $id  ID of the context
     * @param string $key Key to retrieve the value by
     * @return mixed
     */
    public function get(string $id, string $key)
    {
        //
    }

    /**
     * Sets a single value in the context.
     *
     * @param string $id    ID of the context
     * @param string $key   Key to retrieve the value by
     * @param mixed  $value Value to be put
     */
    public function set(string $id, string $key, $value): void
    {
        //
    }

    /**
     * Creates a context with given ID.
     *
     * @param string $id ID of a context
     */
    public function create(string $id): void
    {
        //
    }

    /**
     * Removes a context with given ID.
     *
     * @param string $id ID of a context
     */
    public function remove(string $id): void
    {
        //
    }

    /**
     * Checks if a context with given ID exists.
     *
     * @param string $id ID of a context
     * @return bool
     */
    public function exists(string $id): bool
    {
        //
    }
}
```

To have a better glimpse on how drivers look, you may check examples of them [here](https://github.com/DCzajkowski/colloquy/blob/master/src/Drivers/).
