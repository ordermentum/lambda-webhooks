## JVM Packages Repo

This is the mothership repo for all jvm packages in OM.

To publish a package:
https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-gradle-for-use-with-github-packages

sample publisher:
```
publishing {
        repositories {
            maven {
                name = "JvmPackages"
                url = uri("https://maven.pkg.github.com/ordermentum/jvm-packages")
                credentials {
                      username = "{GITHUB_USER}"
                      password = "{GITHUB_TOKEN"
                }
            }
        }
        publications {
            gpr(MavenPublication) {
                from components.java
                groupId 'io.ordermentum'
                artifactId 'kotlin-extensions'
                version '0.0.9'
            }
        }
    }
```


To use a package:
- Generate a github token that can download packages
- Add to your repositories list and add package
  
  ```
        maven {
                    name = "JvmPackages"
                    url = uri("https://maven.pkg.github.com/ordermentum/jvm-packages")
                    credentials {
                        username = "{GITHUB_USER}"
                        password = "{GITHUB_TOKEN"
                    }
                }
  ```
        
   ```
        implementation("$groupId:$artifactId:$version")
   ```
        For eg.
  ```
        implementation("io.ordermentum:logging:${ordermentumLogger}")
  ```

