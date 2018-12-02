## Using in auto-mode with annotations



### 1. Adopt IdentifierResolver interface

Colloquy needs to **distinguish data** stored in a `context` from each other,
that's why under the hood it creates a `record` with given identifier.
You can think of the 'Identifier' as **unique** name of a save in a game.
When you stop playing you save the game under certain name. When you come back you load save with the same name.
Colloquy does the same. It computes the identifier in *get* method and stores data. 
Later on, it computes identifer again and loads data corresponding to that identifier.

::: warning
`record` identifiers should be unique in a given `context`
:::

**Example:** *store data per session*
```php
<?php

namespace App;

class SessionIdentifierResolver implements \Colloquy\IdentifierResolverInterface
{
    public function get($controller): string
    {
        return // code to get session id 
    }
}
```

### 2. Create new context
You create new `context` by binding!

Every context should have:
 - unique name 
 - Instance of a class implementing IdentifierResolverInterface 
 - Instance of a class implementing DriverInterface

Currently Colloquy supports drivers:
 1. `ConsoleDriver`
 2. `FileDriver`
 3. `MemoryDriver`
 
 ::: tip
 You can create your own [custom driver](/creating-custom-driver.md)
 :::
 
**Example:** *creating session context*
```php

<?php

\Colloquy\Colloquy::bind(
    'session',
    new \App\SessionIdentifierResolver,
    new \Colloquy\Drivers\FileDriver($pathToWritableDirectory)
);
```

### 3. Use annotations

Colloquy introduces four types of annotations:
 - `@ColloquyContext(CONTEXT_NAME)` - **required, one**
 
    tells Colloquy which `context` to use.
    Every property of this class with `@ColloquyPersist` will be autosaved
    
    
- `@ColloquyPersist` - **required, at least one**

    tells Colloquy which class property to autosave.

- ```@ColloquyBegin```  - **required, at least one**
    
    after method annotated with `@ColloquyBegin` is invoked 
    annotated variables will be automatically saved and restored
    
- ```@ColloquyEnd```  - **optional, at least one**
    
    after method annotated with `@ColloquyEnd` returns, current context will be deleted



::: danger
Due to the limitations of annotations usage in PHP
every method or field with annotation should be
either `private` or `protected`. 

If you would like to omit this limitation try [manual use](#manual-use)
::: 
    
    
**Example:** *use in a controller*
```php
<?php

namespace App\Http\Controllers;

/** @ColloquyContext('session') */
class FormController
{
    use \Colloquy\ColloquyContexts;
    
    /** @ColloquyPersist */
    protected $user;

    /** @ColloquyBegin */
    private function step1()
    {
        $this->user = new \App\Models\User;
    }

    private function step2()
    {
        $this->user->name = 'John';
    }

    /** @ColloquyEnd */
    private function step3()
    {
        echo $this->user->name; // John
    }
}
```


## Manual Use


:::tip
Manual use may provide developers with better control over code and actions performed by Colloquy.
However we still **strongly recommend using annotations** as they are convenient and easy to use.
:::    



```php
<?php

use Colloquy\Colloquy;
use Colloquy\Drivers\FileDriver;

class User
{
   private $name;
   
   public function __construct(string $name)
   {
       $this->name = $name;
   }
}

/** Starting a Conversation */

$wrapper = new Colloquy(new FileDriver('storage'));

$homeContext = $wrapper->context('Home');
$formContext = $wrapper->context('Form');

/** Primitive types */

$homeContext->add('Joe', 'name');
$homeContext->add('ilovecats', 'password');
$formContext->add('Jane', 'name');

$name = $homeContext->get('name'); // Joe

$homeContext->set('John', 'name');

$name = $homeContext->get('name'); // John

/** Objects */

$user = new User('Jack');

$homeContext->add($user, 'user');

var_dump($user); // User { name: "Jack" }

$user = $homeContext->get('user');

var_dump($user); // User { name: "Jack" }

/** Ending a Conversation */

$wrapper->end('Form');
$wrapper->end('Home');
```