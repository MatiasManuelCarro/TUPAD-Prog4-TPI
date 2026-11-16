from collections.abc import Callable

from sqlmodel import Session


class UnitOfWork:
    def __init__(
        self,
        session_factory: Callable[[], Session],
    ):
        self.session_factory = session_factory

    def __enter__(self):
        self.session = self.session_factory()
        return self

    def __exit__(
        self,
        exc_type,
        exc_value,
        traceback,
    ):
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()