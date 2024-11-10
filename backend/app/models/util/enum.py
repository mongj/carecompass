from enum import Enum
from typing import TypeVar

E = TypeVar('E', bound=Enum)

def use_enum_values(enum_class: type[E]) -> list[str]:
    return [member.value for member in enum_class]