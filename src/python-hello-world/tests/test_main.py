def test_main(monkeypatch):
    import io
    import sys
    from src.main import main

    # Capture the output of the main function
    monkeypatch.setattr(sys, 'stdout', io.StringIO())
    
    # Call the main function
    main()
    
    # Get the output
    output = sys.stdout.getvalue().strip()
    
    # Assert that the output is as expected
    assert output == "Hello, World!"