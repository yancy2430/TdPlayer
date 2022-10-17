/*
See LICENSE.txt for this sample’s licensing information.

Abstract:
The application delegate class that starts TVML.
*/

import UIKit
import AVKit
import AVFoundation
import TVMLKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {
    // MARK: Properties
    
    var window: UIWindow?
    
    var appController: TVApplicationController?

    /// - Tag: tvBaseURL
    static let tvBaseURL = "http://localhost:9001/static/"
    
    static let tvBootURL = "\(AppDelegate.tvBaseURL)js/application.js"

    // MARK: UIApplication Overrides

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = [:]) -> Bool {
        // Override point for customization after application launch.
        window = UIWindow(frame: UIScreen.main.bounds)
        
        /*
            Create the TVApplicationControllerContext for this application
            and set the properties that will be passed to the `App.onLaunch` function
            in JavaScript.
        */
        let appControllerContext = TVApplicationControllerContext()
        
        /*
            The JavaScript URL is used to create the JavaScript context for your
            TVMLKit application. Although it is possible to separate your JavaScript
            into separate files, to help reduce the launch time of your application
            we recommend creating minified and compressed version of this resource.
            This will allow for the resource to be retrieved and UI presented to
            the user quickly.
        */
        if let javaScriptURL = URL(string: AppDelegate.tvBootURL) {
            appControllerContext.javaScriptApplicationURL = javaScriptURL
        }
        
        appControllerContext.launchOptions = ["baseURL": AppDelegate.tvBaseURL]

        for (key, value) in launchOptions ?? [:] {
            appControllerContext.launchOptions[key.rawValue] = value
        }

        appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(.playback, mode: .moviePlayback)
        }
        catch {
            print("Setting category to AVAudioSessionCategoryPlayback failed.")
        }
        return true
    }

    // MARK: TVApplicationControllerDelegate
    func appController(_ appController: TVApplicationController, evaluateAppJavaScriptIn jsContext: JSContext){
        
               let pushMyViewBlock : @convention(block) (String?) -> Void = {
                   (string : String!) -> Void in
                      DispatchQueue.main.async {
                          guard let url = URL(string: "http://192.168.1.50:9002/upgcxcode/20/76/849277620/849277620-1-112.flv?e=ig8euxZM2rNcNbKzhzdVhwdl7whzhwdVhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1664809668&gen=playurlv2&os=mcdn&oi=3751564900&trid=0000d17bd39a59fe4f378510dc8ef102bcb2u&mid=107050535&platform=pc&upsig=0ec2b06b6029f4412b5a5ca34a21d9bd&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&mcdnid=11000235&bvc=vod&nettype=0&orderid=0,3&agrr=0&bw=435053&logo=A0000400") else { return }
                          // Create an AVPlayer, passing it the HTTP Live Streaming URL.
                          let headers: [String: String] = [
                            "referer": ""
                           ]
                          let asset = AVURLAsset(url: url, options: ["AVURLAssetHTTPHeaderFieldsKey": headers])
                           let playerItem = AVPlayerItem(asset: asset)
                          let player = AVPlayer(playerItem: playerItem)

                          // Create a new AVPlayerViewController and pass it a reference to the player.
                          let controller = AVPlayerViewController()
                          controller.player = player

                          self.appController?.navigationController.present(controller, animated: true){
                              player.play()
                          }
                          
                    }
                   
               }
        
            jsContext.setObject(unsafeBitCast(pushMyViewBlock, to: AnyObject.self), forKeyedSubscript: "AVPlayer" as (NSCopying & NSObjectProtocol)?)
    }
    // MARK: TVApplicationControllerDelegate
    func appController(_ appController: TVApplicationController, evaluateAppJavaScriptIn jsContext: JSContext,didFail error: Error) {
        print("\(#function) invoked with error: \(error)")
        
        let title = "Error Launching Application"
        let message = error.localizedDescription
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        
        self.appController?.navigationController.present(alertController, animated: true, completion: nil)
    }
    
    func player(_ sender: Any) {
        print("a")
    }
    
}
