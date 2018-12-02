## Creating a custom driver

### 1. Custom driver template

In order to create a custom driver, make sure you work accordingly to a template in which those are created. In new custom driver implementation you must create a getter, setter, creator, remover and existance checker. 


**TEMPLATE:**
```php
<?php

namespace Colloquy\Drivers;

class ConsoleDriver implements DriverInterface
{
    public function get(string $id, string $key)
    {
        //* Retrieves a single value from the context.
    }
    public function set(string $id, string $key, $value): void
    {
        //* Sets a single value in the context.
    }
    public function create(string $id): void
    {
       //* Creates a context with given ID.
    }
    public function remove(string $id): void
    {
       //* Removes a context with given ID.
    }
    public function exists(string $id): bool
    {
         //* Checks if a context with given ID exists.
    }
}
```
::: legend
`string $id `   is an ID of the context
`string $key`   is a key to retrieve the value by
`string $value` is a value to be put 
:::

To have a better glimpse on how the drivers look, you may check live examples of them [here](https://github.com/DCzajkowski/colloquy/blob/master/src/Drivers/)
